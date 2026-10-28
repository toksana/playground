// Greedy word wrap. `measure` returns the rendered width of a string, so the caller decides the font.
export const wrapText = (
  text: string,
  maxWidth: number,
  measure: (line: string) => number,
): string[] =>
  text
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .reduce<string[]>((lines, word) => {
      const last = lines[lines.length - 1];
      if (last === undefined) return [word];
      const candidate = `${last} ${word}`;
      return measure(candidate) <= maxWidth
        ? [...lines.slice(0, -1), candidate]
        : [...lines, word];
    }, []);
