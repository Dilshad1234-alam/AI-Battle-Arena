import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export default function ArenaResponse({ solution1, solution2, judge }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [solution1, solution2]);

  const winner =
    judge?.solution_1_score > judge?.solution_2_score
      ? "Mistral"
      : judge?.solution_2_score > judge?.solution_1_score
      ? "Cohere"
      : "Tie";

  const CodeBlock = ({ inline, className, children, ...props }) => {
    const codeText = String(children).replace(/\n$/, "");

    if (inline) {
      return (
        <code
          className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="rounded-xl overflow-hidden my-4 border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <span className="text-xs text-zinc-400">Code</span>
          <button
            onClick={() => navigator.clipboard.writeText(codeText)}
            className="text-xs text-zinc-300 hover:text-white"
          >
            📋 Copy
          </button>
        </div>

        <pre className="p-4 bg-zinc-950 overflow-x-auto text-sm text-zinc-100">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };

  const markdownComponents = {
    h1: ({ node, ...props }) => (
      <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-xl font-bold mt-5 mb-3 text-zinc-900 dark:text-white" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-lg font-bold mt-4 mb-2 text-zinc-900 dark:text-white" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />
    ),
    a: ({ node, ...props }) => (
      <a className="text-blue-600 hover:text-blue-500 underline" {...props} />
    ),
    code: CodeBlock,
  };

  return (
    <div className="flex flex-col gap-8 my-8 px-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Solution 1 · Mistral
          </h3>

          <div className="text-zinc-700 dark:text-zinc-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {solution1}
            </ReactMarkdown>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
            Solution 2 · Cohere
          </h3>

          <div className="text-zinc-700 dark:text-zinc-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {solution2}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {judge && (
        <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="mb-6 bg-yellow-100 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-800 rounded-2xl p-4">
            <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
              🏆 Winner: {winner}
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
              Judge: Cohere
            </p>
          </div>

          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-3 mb-6">
            ⚖️ Judge Recommendations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 px-5 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">
                  Mistral Score
                </span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {judge.solution_1_score}/10
                </span>
              </div>

              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full"
                  style={{ width: `${judge.solution_1_score * 10}%` }}
                />
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed px-2">
                {judge.solution_1_reasoning}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 px-5 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">
                  Cohere Score
                </span>
                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {judge.solution_2_score}/10
                </span>
              </div>

              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3">
                <div
                  className="bg-violet-500 h-3 rounded-full"
                  style={{ width: `${judge.solution_2_score * 10}%` }}
                />
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed px-2">
                {judge.solution_2_reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}