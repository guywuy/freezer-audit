import BackToIndex from "./backToIndex";

interface Props {
  style?: string;
  title: string;
}

export default function SubpageHeader({ title, style = "" }: Props) {
  return (
    <div className={`flex justify-between items-center mb-4 ${style}`}>
      <h3 className="text-2xl font-bold">{title}</h3>
      <BackToIndex />
    </div>
  );
}
