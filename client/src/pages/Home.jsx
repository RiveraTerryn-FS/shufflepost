import React, { useEffect, useState } from "react";
import styled, {keyframes} from "styled-components";
import { useAuth } from "../context/AuthContext";
import { FaArrowUp, FaArrowDown, FaRandom, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { timeAgo } from "../utils/timeAgo";

function Home() {
	const API_URL = import.meta.env.VITE_API_URL;
	const { token } = useAuth();
	const [posts, setPosts] = useState([]);
	const [likingId, setLikingId] = useState(null)
	const [error, setError] = useState("");
	const [animatingPostId, setAnimatingPostId] = useState(null);
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [reloadKey, setReloadKey] = useState(0);
	/* Get users posts */
	const [showUserPosts, setShowUserPosts] = useState(false);
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [userPosts, setUserPosts] = useState([]);
	const [userPage, setUserPage] = useState(1);
	const [userHasMore, setUserHasMore] = useState(false);
	const [loadingUserPosts, setLoadingUserPosts] = useState(false);
	const fetchUserPosts = async (page = 1) => {
		if (!token) return;
		try {
			setLoadingUserPosts(true);
			const res = await fetch(
				`${API_URL}posts/user?page=${page}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!res.ok) {
				throw new Error("Failed to fetch user posts");
			}
			const data = await res.json();
			setUserPosts(prev =>
				page === 1 ? data.data : [...prev, ...data.data]
			);
			setUserHasMore(data.pagination.hasMore);
			setUserPage(page);
		} catch (err) {
			setError(`Fetch user posts error: ${err.message}`);
		} finally {
			setLoadingUserPosts(false);
		}
	};
	useEffect(() => {
		if (!showUserPosts) return;
		setUserPosts([]);
		setUserPage(1);
		setUserHasMore(false);
		fetchUserPosts(1);
	}, [showUserPosts]);
	const loadMoreUserPosts = () => {
		if (loadingUserPosts || !userHasMore) return;
		fetchUserPosts(userPage + 1);
	};
	/* Create posts */
	const [creating, setCreating] = useState(false);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [hidden, setHidden] = useState(false);
	const [anonymous, setAnonymous] = useState(false);
	const handleCreatePost = async (e) => {
		e.preventDefault();
		if (!token) return;
		try {
			setCreating(true);
			const res = await fetch(`${API_URL}posts`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title,
					content,
					hidden,
					anonymous,
				}),
			});
			if (!res.ok) {
				throw new Error("Failed to create post");
			}
			const data = await res.json();
			// Add to user posts 
			setUserPosts(prev => [data.data, ...prev]);
			setUserPage(1);
			// Reset the form
			setTitle("");
			setContent("");
			setHidden(false);
			setAnonymous(false);
			setShowCreatePost(false);
		} catch (err) {
			setError(`Create post error: ${err.message}`);
		} finally {
			setCreating(false);
		}
	};
	/* Get posts */
	const fetchPosts = async () => {
		try {
			setLoadingPosts(true);
			const headers = {};
			if (token) {
				headers.Authorization = `Bearer ${token}`;
			}
			const res = await fetch(`${API_URL}posts/random`, {
				method: "GET",
				headers,
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to load posts");

			const data = await res.json();
			setPosts(data.data || []);
			setReloadKey(prev => prev + 1);
		} catch (err) {
			setError(`Fetch posts error ${err.message}`);
		} finally {
			setLoadingPosts(false);
		}
	};
	useEffect(() => {
		fetchPosts();
	}, [API_URL, token]);
	/* Handle edit post (can only edit hidden or anonymous) */
	const [editingPostId, setEditingPostId] = useState(null);
	const [editHidden, setEditHidden] = useState(false);
	const [editAnonymous, setEditAnonymous] = useState(false);
	const [savingEdit, setSavingEdit] = useState(false);
	const handleSaveEdit = async (postId) => {
		try {
			setSavingEdit(true);
			const res = await fetch(
				`${API_URL}posts/${postId}`,{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						hidden: editHidden,
						anonymous: editAnonymous,
					}),
				}
			);
			if (!res.ok) {
				throw new Error("Failed to update post");
			}
			const data = await res.json();
			// update post
			const updatedPost = data.data;
			console.log(updatedPost);
			setUserPosts(prev =>
				prev.map(p =>
					p._id === postId
						? {
								...p,
								hidden: updatedPost.hidden,
								anonymous: updatedPost.anonymous,
						}
						: p
				)
			);
			setEditingPostId(null);
		} catch (err) {
			setError(`Edit post error: ${err.message}`);
		} finally {
			setSavingEdit(false);
		}
	};
	/* Handle post delete */
	const [deletingPostId, setDeletingPostId] = useState(null);
	const handleDeletePost = async (postId) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this post? This cannot be undone."
		);
		if (!confirmed) return;
		try {
			setDeletingPostId(postId);
			const res = await fetch(`${API_URL}posts/${postId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to delete post");
			}
			setUserPosts(prev => prev.filter(p => p._id !== postId));
			setEditingPostId(null);
		} catch (err) {
			setError(`Delete post error: ${err.message}`);
		} finally {
			setDeletingPostId(null);
		}
	};
	/* Handle Dis/likes */
	const handleLike = async (postId, liked) => {
		if (!token) return;
		if (likingId === postId) return;

		try {
			setLikingId(postId);
			const res = await fetch(`${API_URL}posts/${postId}/like`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ userLiked: liked }),
			});
			if (!res.ok) {
				throw new Error("Like request failed");
			}
			const data = await res.json();
			setPosts(prev => {
				const updated = prev.map(post =>
					post._id === postId
						? {
								...post,
								likes: data.likes,
								userLiked: data.liked,
						}
						: post
				);
				return updated;
			});
			setAnimatingPostId(postId);
			setTimeout(() => setAnimatingPostId(null), 200);
			setLikingId(null);
		} catch (err) {
			setLikingId(null);
			setError(`Like error: ${err.message}`);
		}
	};

	if(error) {
		return (
		<Container>
			<Message>{error}</Message>
		</Container>);
	}
	return (
		<Container>
			<FeedHeader>
				<h2>Posts</h2>
				<ShuffleAction
					type="button"
					onClick={fetchPosts}
					disabled={loadingPosts}
				>
					<ShuffleIcon $loading={loadingPosts}>
						<FaRandom />
					</ShuffleIcon>
					<span>{loadingPosts ? "Shuffling..." : "Shuffle posts"}</span>
				</ShuffleAction>
			</FeedHeader>
		{loadingPosts && (
			<Message>Loading posts...</Message>
		)}
		{posts.length === 0 && (
			<Message>No posts</Message>
		)}
		{posts.map((post, index) => (
			<PostCard
				key={`${post._id}-${reloadKey}`}
				$delay={index * 50}
			>
				<UserPostHeader>
					<span>
						{post.user?.username || "Anonymous"}
					</span>
					<TimeStamp>{timeAgo(post.createdAt)}</TimeStamp>
				</UserPostHeader>
				<Title>{post.title}</Title>
				<Content>{post.content}</Content>
				<LikesRow>
					<LikeButton
						type="button"
						$active={post.userLiked === "up" ? "green" : null}
						disabled={!token || likingId === post._id}
						onClick={() => handleLike(post._id, "up")}
						title={!token ? "Log in to like" : "Like"}
					>
						<FaArrowUp />
					</LikeButton>
					<LikeCount $animate={post._id === animatingPostId}>
						{post.likes || 0}
					</LikeCount>
					<LikeButton
						type="button"
						$active={post.userLiked === "down" ? "red" : null}
						disabled={!token || likingId === post._id}
						onClick={() => handleLike(post._id, "down")}
						title={!token ? "Log in to dislike" : "Dislike"}
					>
						<FaArrowDown />
					</LikeButton>
				</LikesRow>
			</PostCard>
		))}
		{token && (
			<UserPostsSection>
				<UserPostsHeader>
					<ToggleButton
						type="button"
						onClick={() => setShowUserPosts(prev => !prev)}
					>
						<ChevronIcon $open={showUserPosts}>
							<FaChevronRight />
						</ChevronIcon>
						<h2>Your Posts</h2>
					</ToggleButton>
					<CreatePostButton
						type="button"
						onClick={() => setShowCreatePost(prev => !prev)}
					>
						{showCreatePost ? "Cancel" : "Create Post"}
					</CreatePostButton>
				</UserPostsHeader>
				{showCreatePost && (
					<CreatePostForm onSubmit={handleCreatePost}>
						<input
							type="text"
							placeholder="Title (max 55 characters)"
							maxLength={55}
							minLength={3}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>

						<textarea
							placeholder="Write your post (max 500 characters)"
							maxLength={500}
							minLength={3}
							rows={4}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
						/>
						<CheckboxRow>
							<label>
								<input
									type="checkbox"
									checked={anonymous}
									onChange={(e) => setAnonymous(e.target.checked)}
								/>
								Post anonymously
							</label>
							<label>
								<input
									type="checkbox"
									checked={hidden}
									onChange={(e) => setHidden(e.target.checked)}
								/>
								Hidden (only you can see this)
							</label>
						</CheckboxRow>
						<FormActions>
							<button type="submit" disabled={creating}>
								{creating ? "Posting..." : "Post"}
							</button>
						</FormActions>
					</CreatePostForm>
				)}
				{showUserPosts && (
					<UserPostsBody>
						{loadingUserPosts && <Message>Loading your posts...</Message>}
						{!loadingUserPosts && userPosts.length === 0 && (
							<Message>You haven't posted anything yet.</Message>
						)}
						{userPosts.map(post => (
							<PostCard key={post._id}>
								<UserPostHeader>
									<span>
										{post.hidden ? "Hidden" : "Public"}
										{post.anonymous && " • Anonymous"}
									</span>
									<TimeStamp>{timeAgo(post.createdAt)}</TimeStamp>
									<HeaderActions>
										<button
											onClick={() => {
												setEditingPostId(post._id);
												setEditHidden(post.hidden);
												setEditAnonymous(post.anonymous);
											}}
										>
											Edit
										</button>
										<button
											onClick={() => handleDeletePost(post._id)}
											disabled={deletingPostId === post._id}
										>
											Delete
										</button>
									</HeaderActions>
								</UserPostHeader>
								{editingPostId === post._id && (
									<EditControls>
										<label>
											<input
												type="checkbox"
												checked={editHidden}
												onChange={e => setEditHidden(e.target.checked)}
											/>
											Hidden
										</label>
										<label>
											<input
												type="checkbox"
												checked={editAnonymous}
												onChange={e => setEditAnonymous(e.target.checked)}
											/>
											Anonymous
										</label>
										<EditActions>
											<button
												onClick={() => handleSaveEdit(post._id)}
												disabled={savingEdit}
											>
												Save
											</button>
											<button onClick={() => setEditingPostId(null)}>
												Cancel
											</button>
										</EditActions>
									</EditControls>
								)}
								<strong>{post.title}</strong>
								<p>{post.content}</p>
							</PostCard>

						))}
						{loadingUserPosts && (
							<Message>Loading more posts...</Message>
						)}
						{userHasMore && !loadingUserPosts && (
							<LoadMoreButton onClick={loadMoreUserPosts}>
								Load more
							</LoadMoreButton>
						)}
					</UserPostsBody>
				)}
			</UserPostsSection>
		)}
		</Container>
	);
}

export default Home;
/* ---------------- Styled Components ---------------- */
/* Keyframes - ANIMATION */
const bump = keyframes`
	0% { transform: scale(1); }
	50% { transform: scale(1.25); }
	100% { transform: scale(1); }
`;
const fadeUp = keyframes`
	from {
		opacity: 0;
		transform: translateY(8px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;
/* MAIN Styled */
const Container = styled.div`
	max-width: 720px;
	margin: 0 auto;
	padding: 1rem;
`;
const PostCard = styled.div`
	border: 1px solid ${({ theme }) => theme.border};
	background: ${({ theme }) => theme.card};
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
	padding: 0.8rem;
	border-radius: 4px;
	margin-bottom: 12px;
	opacity: 0;
	transform: translateY(8px);
	animation: ${fadeUp} 250ms ease forwards;
	animation-delay: ${({ $delay }) => $delay}ms;
	transition: transform 150ms ease;
	@media (prefers-reduced-motion: reduce) {
		animation: none;
		opacity: 1;
		transform: none;
	}
`;
const Content = styled.p`
	margin-bottom: 10px;
	font-size: 1rem;
`;
const Message = styled.p`
	text-align: center;
	color: ${({ theme }) => theme.secondaryText};
`;
const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.8rem;
	color: ${({ theme }) => theme.secondaryText};
	.user {
		font-weight: 500;
	}
	.dot {
		opacity: 0.8;
	}
`;

const Title = styled.h4`
	margin: 0.5rem 0 0.2rem 0;
	font-size: 1rem;
`;
const LikesRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.5rem;
`;
const LikeButton = styled.button`
	border: none;
	background: transparent;
	cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
	font-size: 1rem;
	opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
	padding: 1px;
	svg {
		color: ${({ $active, theme }) =>
			$active ? $active : theme.secondaryText};
		transition:
			color 150ms ease,
			transform 150ms ease;
		transform: ${({ $active }) =>
			$active ? "scale(1.2)" : "scale(1)"};
	}
	&:hover svg {
		transform: scale(1.15);
	}
	&:hover {
		background-color:transparent;
	}
`;
const LikeCount = styled.span`
	font-size: 0.9rem;
	min-width: 24px;
	text-align: center;
	display: inline-block;
	animation: ${({ $animate }) => ($animate ? bump : "none")} 200ms ease;
`;
const FeedHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
`;
const ShuffleAction = styled.button`
	display: flex;
	align-items: center;
	gap: 6px;
	border: none;
	background: transparent;
	color: ${({ theme }) => theme.secondaryText};
	cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
	font-size: 0.9rem;
	font-weight:600;
	opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
	padding: 4px 6px;

	&:hover {
		color: ${({ theme }) => theme.text};
		background-color:transparent;
		transform: scale(1.02);
		
	}
`;
const ShuffleIcon = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
`;
const UserPostsSection = styled.section`
	margin-top: 2rem;
	border-top: 1px solid ${({ theme }) => theme.border};
	padding-top: 1rem;
`;
const UserPostsHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem 0;
`;
const ToggleButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	background: transparent;
	border: none;
	cursor: pointer;
	color: ${({ theme }) => theme.text};
	padding: 0;
	line-height: 1;
	&:hover {
		background-color: transparent;
		color: ${({ theme }) => theme.text};
		transform: scale(1.02);	
	}
	h2 {
		margin: 0;
		line-height: 1; 
	}
`;
const ChevronIcon = styled.span`
	display: inline-flex;
	align-items: center;
	font-size: 1.1rem;
	transition: transform 150ms ease;
	transform: rotate(${({ $open }) => ($open ? "90deg" : "0deg")});
`;
const UserPostsBody = styled.div`
	margin-top: 1rem;
	display: grid;
	gap: 12px;
`;
const CreatePostButton = styled.button`
	border: 1px solid ${({ theme }) => theme.border};
	background: ${({ theme }) => theme.card};
	color: ${({ theme }) => theme.text};
	border-radius: 4px;
	cursor: pointer;
	&:hover {
		background-color: ${({ theme }) => theme.accentSoft};
		color: ${({ theme }) => theme.text};
		border-color: ${({ theme }) => theme.accent};
		transform: scale(1.02);	
	}
`;
const CreatePostForm = styled.form`
	margin-top: 1rem;
	display: flex;
	flex-direction: column;
	gap: 10px;
	input, textarea {
		border: 1px solid ${({ theme }) => theme.border};
		background: ${({ theme }) => theme.card};
		color: ${({ theme }) => theme.text};
		padding: 1rem;
		border-radius: 4px;
	}
	textarea {
		resize: vertical;
	}
	button {
		align-self: flex-end;
		border: 1px solid ${({ theme }) => theme.border};
		background: ${({ theme }) => theme.card};
		color: ${({ theme }) => theme.text};
		border-radius: 4px;
		cursor: pointer;
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
		&:hover:not(:disabled) {
			background-color: ${({ theme }) => theme.accentSoft};
			color: ${({ theme }) => theme.text};
			border-color: ${({ theme }) => theme.accent};
			transform: scale(1.02);	
		}
	}
`;
const CheckboxRow = styled.div`
	display: flex;
	gap: 16px;
	font-size: 0.9rem;
	label {
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
	}
`;
const FormActions = styled.div`
	display: flex;
	justify-content: flex-end;
`;
const UserPostHeader = styled.div`
	display: grid;
	grid-template-columns: 1fr auto auto;
	align-items: center;
	gap: 10px;
	font-size: 0.8rem;
	color: ${({ theme }) => theme.secondaryText};
	margin-bottom: 4px;
`;
const TimeStamp = styled.span`
	white-space: nowrap;
`;
const HeaderActions = styled.div`
	display: flex;
	gap: 8px;
	button {
		border: 1px solid transparent;
		background: transparent;
		color: ${({ theme }) => theme.secondaryText};
		cursor: pointer;
		font-size: 0.8rem;
		transition: color 120ms ease;
		&:hover {
			background-color: ${({ theme }) => theme.accentSoft};
			color: ${({ theme }) => theme.text};
			border: 1px solid ${({ theme }) => theme.border};
			transform: scale(1.02);	
		}
		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
`;
const LoadMoreButton = styled.button`
	margin: 0.5rem auto 0;
	display: block;
	border: 1px solid ${({ theme }) => theme.border};
	background: ${({ theme }) => theme.card};
	color: ${({ theme }) => theme.text};
	border-radius: 4px;
	cursor: pointer;
	&:hover {
		background-color: ${({ theme }) => theme.accentSoft};
		color: ${({ theme }) => theme.text};
		border-color: ${({ theme }) => theme.accent};
		transform: scale(1.02);	
	}
`;
const EditControls = styled.div`
	margin-top: 6px;
	display: flex;
	gap: 12px;
	font-size: 0.8rem;
	align-items: center;
	label {
		display:flex;
		gap:4px;
	}
`;
const EditActions = styled.div`
	margin-left: auto;
	display: flex;
	gap: 6px;
	button {
		border: 1px solid transparent;
		background: transparent;
		color: ${({ theme }) => theme.secondaryText};
		cursor: pointer;

		&:hover {
			background-color: ${({ theme }) => theme.accentSoft};
			color: ${({ theme }) => theme.text};
			border-color: ${({ theme }) => theme.accent};
			transform: scale(1.02);	
		}
	}
`;