import Link from 'next/link';
import { ArrowRight, Sparkles, Image as ImageIcon, Video } from 'lucide-react';

export const metadata = {
    title: 'AIBlog | Next-Gen AI Blogging Platform',
    description: 'Turn your notes into polished, engaging blog posts in seconds using advanced AI models.',
};

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="py-6 px-8 flex justify-between items-center glass-panel m-4 rounded-full border border-white/10 sticky top-4 z-50 shadow-xl">
                <div className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400 flex items-center gap-2">
                    <Sparkles className="text-blue-400" size={24} /> AIBlog
                </div>
                <div className="flex gap-4">
                    <Link href="/login" className="px-5 py-2 rounded-full font-medium hover:bg-white/5 transition-colors">
                        Log In
                    </Link>
                    <Link href="/register" className="primary-btn px-6 py-2">
                        Get Started
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center -mt-10 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                        Turn your messy notes into <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400">
                            polished masterpieces
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Write down your thoughts, upload images, and drop YouTube links.
                        Our advanced AI takes care of the formatting, expansion, and structure to create stunning blog posts ready to publish.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Link href="/register" className="primary-btn text-lg px-8 py-4 flex items-center gap-2">
                            Start Creating for Free <ArrowRight size={20} />
                        </Link>
                        <Link href="#features" className="px-8 py-4 text-slate-300 hover:text-white transition-colors">
                            See how it works
                        </Link>
                    </div>
                </div>

                <div id="features" className="mt-32 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-20">
                    <FeatureCard
                        icon={<Sparkles className="text-blue-400 mb-4" size={32} />}
                        title="AI-Powered Generation"
                        description="Leverage top-tier models from NVIDIA, Anthropic, and Google to intelligently expand and structure your raw thoughts."
                    />
                    <FeatureCard
                        icon={<ImageIcon className="text-violet-400 mb-4" size={32} />}
                        title="Seamless Media"
                        description="Drag and drop images seamlessly. The AI automatically positions them perfectly within your generated article."
                    />
                    <FeatureCard
                        icon={<Video className="text-fuchsia-400 mb-4" size={32} />}
                        title="YouTube Integration"
                        description="Easily embed videos. The AI understands the context and naturally references them in your blog post."
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="glass-panel p-8 hover:bg-white/[0.03] transition-colors group">
            <div className="transform group-hover:scale-110 transition-transform duration-300 origin-left">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}
