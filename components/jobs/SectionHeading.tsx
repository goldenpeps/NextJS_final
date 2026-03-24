type SectionHeadingType = {
  title: string;
  rightContent?: React.ReactNode;
};

export default function SectionHeading({ title, rightContent }: SectionHeadingType) {
  return (
    <div className="jobs-section-heading">
      <h1>{title}</h1>
      {rightContent ? <div className="jobs-section-heading__meta">{rightContent}</div> : null}
    </div>
  );
}
