import { useQueryClient } from "@tanstack/react-query";
import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QueryProvider } from "./query-provider";

const defaults = () => {
  const { result } = renderHook(() => useQueryClient(), {
    wrapper: QueryProvider,
  });

  return result.current.getDefaultOptions().queries;
};

describe("QueryProvider", () => {
  it("renders what it wraps", () => {
    render(
      <QueryProvider>
        <p>Devices</p>
      </QueryProvider>,
    );

    expect(screen.getByText("Devices")).toBeVisible();
  });

  it("treats data as fresh for a minute rather than refetching constantly", () => {
    expect(defaults()?.staleTime).toBe(60_000);
  });

  it("does not refetch on focus, which would only flicker the mock data", () => {
    expect(defaults()?.refetchOnWindowFocus).toBe(false);
  });

  it("keeps one client for the session instead of a new one per render", () => {
    const { result, rerender } = renderHook(() => useQueryClient(), {
      wrapper: QueryProvider,
    });

    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });
});
