export function ConnectorItem({
  name,
  iconUrl,
  onClick,
}: {
  name: string;
  iconUrl: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={() => onClick()}
      className="border border-black rounded-[13px] py-[12px] px-[24px] text-black h-[56px] flex items-center hover:bg-black hover:text-white"
    >
      <img src={iconUrl} className="w-[32px] h-[32px] mr-[12px]" />

      {name}
    </button>
  );
}
