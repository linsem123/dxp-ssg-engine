export default async function BlogPage() {
    const res = await fetch('http://localhost:3000/api/items');
    const post = await res.json();

    return (
        <div>
            <h1>Blog Posts</h1>
            <div>
                {post.title}
                <p>{post.body}</p>
            </div>
        </div>
    );
}
