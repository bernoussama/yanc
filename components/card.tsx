import { Movie, TvShow } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function Card({ item }: { item: Movie | TvShow }) {
  return (
    <Link
      href={"title" in item ? `/movie/${item.id}` : `/tv/${item.id}`}
      className="relative group w-48 h-72 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
    >
      <div className="relative w-full h-full">
        <Image
          src={getImageUrl(item.poster_path)!}
          alt={"title" in item ? item.title : item.name}
          fill
          className="rounded-sm object-cover md:rounded"
        />
      </div>
      <div className="absolute w-full h-full inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="">
          <h3 className="text-white font-medium">
            {"title" in item ? item.title : item.name}
          </h3>
          <p className="text-sm text-white/70">
            {new Date(
              "first_air_date" in item
                ? item.first_air_date
                : item.release_date,
            ).getFullYear()}
            {" • "}
            {item.vote_average.toFixed(1)} ★
          </p>
        </div>
      </div>
    </Link>
  );
}
