const PlusProfileButton = () => {
  return (
    <button
      className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
      aria-label="Edit profile picture"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 4V16M4 10H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

export default PlusProfileButton;
