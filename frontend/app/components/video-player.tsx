
interface VideoPlayerProps {
    url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
    return (
        <>
            <div>
                <iframe
                    src={url}
                    className="w-full h-120 border shadow-2xl my-10"
                    allowFullScreen
                />
            </div>
        </>
    )
}