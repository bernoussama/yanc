import { auth } from "@/auth";

export const runtime = "edge";

export default async function Home() {
  const user = await auth();
  console.log(user!);

  return (
    <div>
      <h1 className="text-3xl font-bold">Nextflix</h1>
    </div>
  );
}
