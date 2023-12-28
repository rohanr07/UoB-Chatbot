"use client";
import Link from "next/link";
import React from "react";
interface RedirectButtonProps {
  destination: string;
  buttonText: string;
  message?: string; // Optional message prop
}

const QuestionPrompt: React.FC<RedirectButtonProps> = ({
  destination,
  buttonText,
  message,
}) => {
  return (
      <Link href={{pathname: destination, query: {message}}}>
        <button>{buttonText}</button>
      </Link>
  );
};

export default QuestionPrompt;