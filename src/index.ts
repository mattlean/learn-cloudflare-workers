import { Hono } from "hono"
import { cors } from "hono/cors"

type Bindings = {
	DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()
app.use("/api/*", cors())

app.get("/api/posts/:slug/comments", async (c) => {
	const { slug } = c.req.param()
	const { results } = await c.env.DB.prepare(
		"SELECT * FROM comments WHERE post_slug = ?",
	)
		.bind(slug)
		.run()
	return c.json(results)
})

app.post("/api/posts/:slug/comments", async (c) => {
	const { slug } = c.req.param()
	const { author, body } = await c.req.json<{
		author: string
		body: string
	}>()

	if (!author) return c.text("Missing author value for new comment", 400)
	if (!body) return c.text("Missing body value for new comment", 400)

	const { success } = await c.env.DB.prepare(
		"INSERT INTO comments (author, body, post_slug) VALUES (?, ?, ?)",
	)
		.bind(author, body, slug)
		.run()

	if (success) {
		c.status(201)
		return c.text("Created")
	} else {
		c.status(500)
		return c.text("Something went wrong")
	}
})

app.get("/api/ping", (c) => {
	return c.text("pong")
})

export default app
