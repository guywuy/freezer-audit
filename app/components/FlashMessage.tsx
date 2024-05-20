import { useEffect, useState } from "react";

interface Props {
  variant: "ERROR" | "SUCCESS";
  text: string;
}

export const FlashMessage = ({ variant, text }: Props) => {
  const [alert, setAlert] = useState(true);

  useEffect(() => {
    setAlert(true);
  }, [text]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    alert && <p className={`fixed z-20 bg-orange-500 ${variant}`}>{text}</p>
  );
};
