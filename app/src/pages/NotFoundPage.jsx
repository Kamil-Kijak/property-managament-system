import { Link } from "react-router-dom";


export default function NotFoundPage({}) {
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <section className="base-card gap-y-5">
                <h1 className="text-black text-4xl font-bold">Ups - Strony nie znaleziono</h1>
                <h1 className="text-6xl font-bold text-green-500">404</h1>
                <section>
                    <Link to={"/lands"}><button className="base-btn text-2xl">Powrót</button></Link>
                </section>
            </section>
        </main>
    )
}