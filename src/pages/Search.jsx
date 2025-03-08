import { useState, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { fetchSearchResults } from "../apiService/fetchSearchResults";
import './search.css'

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // For keyboard navigation
  const [showPopup, setShowPopup] = useState(false);
  const inputRef = useRef(null); // To detect clicks outside popup
  
  // Debounced value
  const debouncedQuery = useDebounce(query, 500);

  // Fetch Data using XHR
  const fetchResults = async (searchTerm, suggestion) => {
    if (searchTerm.length <= 3) {
      if(suggestion){
        setSuggestion([])
      } else{
          setResults([]);
      }
      return;
    }
    if(!suggestion)
    setLoading(true);
    const res = await fetchSearchResults(searchTerm);
    if(suggestion){
        setSuggestion(res)
      } else{
        setResults(res);
        setLoading(false);
      }
  };

  useEffect(() => {
    if(debouncedQuery?.length > 3){
        fetchResults(debouncedQuery, true);
    }
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container">
      <h2>Search Comments</h2>
      <div className="search-box">
        <div className="typeahead-container" ref={inputRef}>

        <input
          type="text"
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowPopup(true)}
        />
        {showPopup && suggestions.length > 0 && (
            <ul data-testid="suggestion" className="typeahead-popup">
            {suggestions.map((item, index) => (
                <li
                key={item.id}
                className={index === selectedIndex ? "active" : ""}
                onClick={() => {
                    fetchResults(item.name);
                    setQuery(item.name);
                    setShowPopup(false);
                }}
                >
                {item.name}
                </li>
            ))}
            </ul>
        )}
        </div>
        <button onClick={() => fetchResults(query)} disabled={query.length <= 3}>
          Search
       </button>
      </div>
      
      {loading && <p>Loading...</p>}
      <ul role="list">
        {results.map(({ id, name, email, body }) => (
          <li key={id}>
            <strong>{name}</strong> (<i>{email}</i>)<br />
            {body.length > 64 ? body.substring(0, 64) + "..." : body}
          </li>
        ))}
      </ul>
    </div>
  );
}
