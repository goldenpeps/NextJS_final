type TitleType = {
  tag: "h1" | "h2";
  topLine?: string;
  bottomLine?: string;
  children: React.ReactNode;
};

export default function Title({
  tag = "h1",
  topLine,
  bottomLine,
  children,
}: TitleType) {
  const Tag = tag;
  return (
    <Tag className="flex flex-col leading-tight">
      {topLine && <span className="text-sm font-normal">{topLine}</span>}
      <span className="uppercase">{children}</span>
      {bottomLine && <span className="text-sm font-normal">{bottomLine}</span>}
    </Tag>
  );
}
