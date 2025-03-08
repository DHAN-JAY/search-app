import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";
import { vi } from "vitest";

vi.useFakeTimers(); // Mock timer functions

test("useDebounce delays updating value", () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
    initialProps: { value: "React" },
  });

  expect(result.current).toBe("React");

  // Change the value
  rerender({ value: "ReactJS" });
  expect(result.current).toBe("React"); // Should NOT update immediately

  act(() => {
    vi.advanceTimersByTime(500); // Fast-forward time
  });

  expect(result.current).toBe("ReactJS"); // Now it should update
});
