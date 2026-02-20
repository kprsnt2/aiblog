import { getUserByUsername, getBlogs } from '@/lib/storage';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Calendar, Eye, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default async function UserBlogPage({ params }) {
    const { username } = await params;
    const user = await getUserByUsername(username);

    if (!user) {
        notFound();
    }

    const blogs = await getBlogs(username);

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                <header className="text-center space-y-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -z-10" />
                    <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-white/50 hover:text-white transition-colors mb-6">
                        <Sparkles size={18} /> AIBlog
                    </Link>
                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl shadow-blue-500/20">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">{username}'s Blog</h1>
                    <p className="text-slate-400">AI-powered insights and thoughts.</p>
                </header>

                {blogs.length === 0 ? (
                    <div className="text-center text-slate-500 py-12">
                        No posts published yet.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {blogs.map(blog => (
                            <Link key={blog.id} href={`/blog/${username}/${blog.slug}`} className="block group">
                                <article className="glass-panel p-8 hover:bg-white/[0.04] transition-all duration-300 hover:scale-[1.01]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                                            {blog.category}
                                        </span>
                                        <span className="text-slate-500 text-sm flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {format(new Date(blog.date), 'MMM d, yyyy')}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-100 mb-3 group-hover:text-blue-400 transition-colors">
                                        {blog.title}
                                    </h2>

                                    <div className="text-slate-400 line-clamp-3 text-sm leading-relaxed mb-6">
                                        {/* Crude excerpt by stripping markdown manually for MVP */}
                                        {blog.markdown.replace(/[#*`_\[\]()]/g, '').substring(0, 200)}...
                                    </div>

                                    <div className="flex items-center gap-4 text-sm font-medium">
                                        <span className="text-slate-500 flex items-center gap-1.5">
                                            <Eye size={16} /> {blog.views || 0} views
                                        </span>
                                        <span className="text-slate-600 flex items-center gap-1.5 ml-auto">
                                            <Sparkles size={16} className="text-violet-500/50" />
                                            {blog.aiModel}
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
