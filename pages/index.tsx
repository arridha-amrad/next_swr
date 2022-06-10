import { useRouter } from "next/router";

const Home = () => {
   const router = useRouter();
   return <button onClick={() => router.push("/posts/98")}>Go to post 1</button>;
};

export default Home;
