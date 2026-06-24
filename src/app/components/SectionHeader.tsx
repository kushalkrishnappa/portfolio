export default function SectionHeader({ command }: { command: string }) {
  return (
    <div className="text-green-400 mb-4">
      <span className="text-green-500">$</span> {command}
    </div>
  );
}
