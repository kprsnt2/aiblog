"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Image as ImageIcon, Video, Upload, X, Loader2 } from 'lucide-react';

export default function NewBlogPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('Technology');
    const [images, setImages] = useState([]);
    const [youtubeUrls, setYoutubeUrls] = useState([]);
    const [ytInput, setYtInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleImageUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setImages(prev => [...prev, data.url]);
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (err) {
            alert('Network error during upload');
        }
    }

    function addYoutubeUrl() {
        if (!ytInput) return;
        try {
            new URL(ytInput); // basic validation
            setYoutubeUrls(prev => [...prev, ytInput]);
            setYtInput('');
        } catch {
            alert('Invalid URL');
        }
    }

    async function handleGenerate(e) {
        e.preventDefault();
        if (!title || !content) {
            setError('Title and notes are required.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                    category,
                    images,
                    youtubeUrls
                })
            });

            const data = await res.json();
            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(data.error || 'Generation failed');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
                <p className="text-slate-400">Pour in your raw notes, add some media, and let AI do the heavy lifting.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-8 pb-20">
                <div className="glass-panel p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Blog Title</label>
                        <input
                            type="text"
                            required
                            className="input-field text-lg font-medium"
                            placeholder="e.g. The Future of AI in Blogging"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Category</label>
                            <select
                                className="input-field appearance-none"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                disabled={loading}
                            >
                                {['Technology', 'Lifestyle', 'Business', 'Education', 'Health', 'General'].map(c => (
                                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="ai, tech, future"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Raw Notes & Thoughts</label>
                    <textarea
                        required
                        className="input-field min-h-[300px] resize-y font-mono text-sm leading-relaxed"
                        placeholder="Dump your thoughts here..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon className="text-violet-400" size={20} />
                            <h3 className="font-medium text-white">Images</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {images.map((img, i) => (
                                    <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                            className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}

                                <label className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors text-slate-400 hover:text-blue-400">
                                    <Upload size={20} />
                                    <span className="text-[10px] mt-1">Upload</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Video className="text-fuchsia-400" size={20} />
                            <h3 className="font-medium text-white">YouTube Videos</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    className="input-field text-sm"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={ytInput}
                                    onChange={e => setYtInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addYoutubeUrl())}
                                    disabled={loading}
                                />
                                <button type="button" onClick={addYoutubeUrl} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10" disabled={loading}>
                                    Add
                                </button>
                            </div>

                            <ul className="space-y-2">
                                {youtubeUrls.map((url, i) => (
                                    <li key={i} className="flex items-center justify-between text-sm bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                                        <span className="truncate pr-4 text-slate-300">{url}</span>
                                        <button type="button" onClick={() => setYoutubeUrls(youtubeUrls.filter((_, idx) => idx !== i))} className="text-slate-500 hover:text-red-400">
                                            <X size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 z-40 flex justify-center">
                    <button
                        type="submit"
                        className="primary-btn px-10 py-3 text-lg flex items-center gap-3 w-full max-w-sm"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Generate Blog Post
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
