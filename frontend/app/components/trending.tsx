
'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { animeApi } from "../services/animeApi"
import AnimeListItem from "../types/anime-list-item"
import { useAnime } from "../context/anime-context"

export default function Trending() {
    const [trending, setTrending] = useState<AnimeListItem[]>([])
    const { setSelectedAnime } = useAnime()

    useEffect(() => {
        const getTrendings = async () => {
            const result = await animeApi.getTopAnime('bypopularity', 15)
            setTrending(result.results)
        }

        getTrendings()
    }, [])

    return (
        <div className="flex justify-center items-center">
            <div className="md:w-[90%]">
                <h2 className="capitalize tracking-tighter font-semibold text-3xl pb-4">Melhores Notas</h2>

                <div className="">
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-4 m-2">
                        {trending.length > 0 ? (
                            trending.map((anime) => (
                                <Link
                                    href={`/anime/${anime.mal_id}`}
                                    key={anime.mal_id}
                                    className="relative h-80 transform duration-100 ease-in hover:scale-103 cursor-pointer"
                                    onClick={() => setSelectedAnime(anime)}
                                >
                                    <img
                                        src={anime.images.webp?.large_image_url}
                                        alt={anime.title}
                                        className="w-full h-full object-cover shadow-4xl absolute rounded"
                                    />
                                    <div className="relative h-full bg-linear-to-b from-black/20 to-black/80 flex flex-col-reverse justify-start items-end text-white shadow-2xl rounded">
                                        <p className="w-full px-2 text-xl my-1 font-semibold z-40 tracking-tighter leading-5">{anime.title}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>Carregando...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}