export default function Home() {
  return (
    <div className="flex justify-center items-center flex-col gap-4 m-8">
      <h1 className="font-bold">Testing if tailwind works</h1>
      <div className="border text-blue-400">Border test</div>
      <div className="text-lg">Text size test</div>
      <div className="flex space-x-2">
        <span>Item 1</span>
        <span>Item 2</span>
      </div>
    </div>
  );
}
