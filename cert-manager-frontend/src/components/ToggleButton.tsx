'use client';

const ToggleButton = ({ toggle, isOpen }: { toggle: any; isOpen: boolean }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute right-4 top-[14px] z-30"
  >
    <div className="flex flex-col justify-items-center gap-1.5">
      <span
        className={`h-0.5 w-5 rounded-full bg-black transition ${
          isOpen && "rotate-45 translate-y-2"
        }`}
      />
      <span
        className={`h-0.5 w-5 rounded-full bg-black transition ${
          isOpen && "scale-x-0"
        }`}
      />
      <span
        className={`h-0.5 w-5 rounded-full bg-black transition ${
          isOpen && "-rotate-45 -translate-y-2"
        }`}
      />
    </div>
  </button>
);

export default ToggleButton;
