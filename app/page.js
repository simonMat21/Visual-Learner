import P5Sketch from "./components/P5Sketch";
import NumberInput from "./components/NumberInput";

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-bold underline">Algo visuvalizor</h1>
      <NumberInput />
      <P5Sketch />
    </main>
  );
}
