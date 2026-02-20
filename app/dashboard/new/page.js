"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Image as ImageIcon, Video, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

            <form onSubmit={handleGenerate} className="space-y-8 pb-32">
                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-300 ml-1">Blog Title</Label>
                            <Input
                                id="title"
                                type="text"
                                required
                                className="text-lg font-medium bg-slate-950/50 border-white/10"
                                placeholder="e.g. The Future of AI in Blogging"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300 ml-1">Category</Label>
                                <Select value={category} onValueChange={setCategory} disabled={loading}>
                                    <SelectTrigger className="bg-slate-950/50 border-white/10">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                        {['Technology', 'Lifestyle', 'Business', 'Education', 'Health', 'General'].map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-slate-300 ml-1">Tags (comma separated)</Label>
                                <Input
                                    id="tags"
                                    type="text"
                                    className="bg-slate-950/50 border-white/10"
                                    placeholder="ai, tech, future"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                    <CardContent className="pt-6 space-y-2">
                        <Label htmlFor="content" className="text-slate-300 ml-1">Raw Notes & Thoughts</Label>
                        <Textarea
                            id="content"
                            required
                            className="min-h-[300px] resize-y font-mono text-sm leading-relaxed bg-slate-950/50 border-white/10 text-white"
                            placeholder="Dump your thoughts here..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            disabled={loading}
                        />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <ImageIcon className="text-violet-400" size={20} />
                                Images
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 backdrop-blur-xl border-white/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Video className="text-fuchsia-400" size={20} />
                                YouTube Videos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    type="url"
                                    className="bg-slate-950/50 border-white/10"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={ytInput}
                                    onChange={e => setYtInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addYoutubeUrl())}
                                    disabled={loading}
                                />
                                <Button type="button" variant="outline" onClick={addYoutubeUrl} className="border-white/10 bg-white/5 hover:bg-white/10" disabled={loading}>
                                    Add
                                </Button>
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
                        </CardContent>
                    </Card>
                </div>

                <div className="fixed bottom-0 left-0 w-full p-4 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 z-40 flex justify-center">
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-xl shadow-blue-500/25 px-10 h-14 text-lg w-full max-w-sm"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2" size={20} />
                                Generate Blog Post
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
