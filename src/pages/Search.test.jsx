import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import Search from "./Search";

// Mock XHR
global.XMLHttpRequest = vi.fn(() => {
    const xhrMock = {
      open: vi.fn(),
      setRequestHeader: vi.fn(),
      readyState: 4,
      status: 200,
      responseText: JSON.stringify([
        { id: 1, name: "John Doe", email: "john@example.com", body: "Sample comment text here..." }
      ]),
      onreadystatechange: null, // Store callback
      send: function () {
        setTimeout(() => {
            if (this.onreadystatechange) {
              this.onreadystatechange();
            }
          }, 100); // Simulated delay
      },
    };
    return xhrMock;
  });
  

test("renders search input and button", () => {
  render(<Search />);
  expect(screen.getByPlaceholderText("Type to search...")).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
});

test("does not fetch data for short input", async () => {
  render(<Search />);
  const input = screen.getByPlaceholderText("Type to search...");
  fireEvent.change(input, { target: { value: "abc" } });

  await waitFor(() => {
    expect(global.XMLHttpRequest).not.toHaveBeenCalled();
  });
});

test("fetches and displays suggestions after typing", async () => {
    render(<Search />);

    // Simulate typing
    const input = screen.getByPlaceholderText("Type to search...");
    fireEvent.focus(input); // to show popup
    fireEvent.change(input, { target: { value: "ReactJS" } });

    // Wait for suggestions to appear
    await waitFor(() => {
        const list = screen.getByTestId("suggestion"); // Select the <ul> element
        const resultItem = within(list).getByText("John Doe");
        expect(resultItem).toBeInTheDocument();
    });
  });

test("fetches and displays search results", async () => {
  render(<Search />);
  const input = screen.getByPlaceholderText("Type to search...");
  fireEvent.focus(input); // to show popup
  fireEvent.change(input, { target: { value: "ReactJS" } });

  await waitFor(() => {
    const list = screen.getByTestId("suggestion"); // Select the <ul> element
    const resultItem = within(list).getByText("John Doe"); // Search only inside <ul>
    // console.log(resultItem);
    expect(resultItem).toBeInTheDocument();
  });
  const list = screen.getByTestId("suggestion"); // Select the <ul> element
  const resultItem = within(list).getByText("John Doe"); // Search only inside <ul>

  fireEvent.click(resultItem);

  await waitFor(() => {
    const list = screen.getByRole("list", { role: "list" }); // Select the <ul> element
    const resultItem = within(list).getByText("John Doe"); // Search only inside <ul>
    // console.log(resultItem);
    expect(resultItem).toBeInTheDocument();
  });
  
});
