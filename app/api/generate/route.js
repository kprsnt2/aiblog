import { NextResponse } from 'next/server';
import { generateBlogContent } from '@/lib/ai-providers';
import { saveBlog } from '@/lib/storage';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import slugify from 'slugify';

export async function POST(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await verifyToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { title, content, images, youtubeUrls, tags, category } = await request.json();

        // Construct the prompt for AI
        let promptContent = `Write a blog post about: ${title}\n\n`;
        promptContent += `User Notes/Content:\n${content}\n\n`;

        if (images && images.length > 0) {
            promptContent += `Please include these images where relevant in the markdown using <img> or ![]() syntax:\n`;
            images.forEach(img => promptContent += `- ${img}\n`);
            promptContent += `\n`;
        }

        if (youtubeUrls && youtubeUrls.length > 0) {
            promptContent += `Please embed these YouTube videos using an iframe (width="100%", height="400") where relevant:\n`;
            youtubeUrls.forEach(url => promptContent += `- ${url}\n`);
        }

        const aiResult = await generateBlogContent(promptContent);
        const slug = slugify(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 8);

        const blogData = {
            id: slug,
            slug,
            title,
            markdown: aiResult.content,
            aiModel: aiResult.model,
            tags: tags || [],
            category: category || 'General',
            date: new Date().toISOString(),
            author: user.username,
            views: 0
        };

        await saveBlog(user.username, blogData);

        return NextResponse.json({ success: true, blog: blogData });
    } catch (error) {
        console.error('Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
