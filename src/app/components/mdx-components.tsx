import React from "react";

export const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="text-2xl font-bold text-white mt-8 mb-3" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="text-xl font-bold text-white mt-8 mb-3" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="text-lg font-bold text-white mt-6 mb-2" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="text-gray-300 leading-relaxed mb-4" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-cyan-400 hover:text-cyan-300 underline" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc list-inside space-y-1 mb-4 text-gray-300" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-300" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="text-gray-300" {...props} />,
  code: (props: React.ComponentProps<"code">) => (
    <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm" {...props} />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm my-4"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="border-l-2 border-gray-700 pl-4 text-gray-400 italic my-4" {...props} />
  ),
};
