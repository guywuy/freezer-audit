import { Link } from "@tanstack/react-router";

interface Props {
  style?: string;
  backTo?: string;
}

export default function BackToIndex({ style = "", backTo }: Props) {
  return (
    <Link
      className={`bg-white p-2 border-2 border-fuchsia-600 rounded-md self-end justify-self-end ${style}`}
      to={backTo ? backTo : "/items"}
    >
      <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414 4.242 4.242-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414-4.242-4.242 4.242-4.242z" />
      </svg>
    </Link>
  );
}
