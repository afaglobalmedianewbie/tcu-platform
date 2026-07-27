import fs from 'fs';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'src/data/posts.json');

export async function GET(request) {
  try {
    const filePath = getFilePath();
    let posts = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      posts = JSON.parse(fileContents);
    }
    return new Response(JSON.stringify({ success: true, posts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subtitle, excerpt, content, author } = body;
    if (!title || !excerpt || !content) {
      return new Response(JSON.stringify({ success: false, message: 'Title, Excerpt, and Content are required.' }), { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    const date = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    const newPost = {
      title,
      subtitle: subtitle || '',
      slug,
      excerpt,
      content,
      date,
      author: author || 'Admin'
    };

    const filePath = getFilePath();
    let posts = [];
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      posts = JSON.parse(fileContents);
    }

    posts.push(newPost);
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    return new Response(JSON.stringify({ success: true, post: newPost }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    if (!slug) {
      return new Response(JSON.stringify({ success: false, message: 'Slug is required.' }), { status: 400 });
    }

    const filePath = getFilePath();
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ success: false, message: 'No posts found.' }), { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    let posts = JSON.parse(fileContents);
    const filteredPosts = posts.filter(post => post.slug !== slug);

    if (posts.length === filteredPosts.length) {
      return new Response(JSON.stringify({ success: false, message: 'Post not found.' }), { status: 404 });
    }

    fs.writeFileSync(filePath, JSON.stringify(filteredPosts, null, 2));
    return new Response(JSON.stringify({ success: true, message: 'Post deleted successfully.' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
