"use client";

import { useMemo } from "react";
import { marked } from "marked";

type Props = {
  content: string;
};

export default function MarkdownContent({ content }: Props) {
  const html = useMemo(() => {
    const renderer = new marked.Renderer();

    renderer.heading = function ({ text, depth }) {
      const id = text
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h${depth} id="${id}">${text}</h${depth}>`;
    };

    return marked.parse(content, { renderer }) as string;
  }, [content]);

  return (
    <div
      className="blog-post-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}