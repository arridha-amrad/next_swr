import { FC, Suspense, useEffect, useState, useTransition } from "react";
import useSWR from "swr";
import { ErrorBoundary } from "react-error-boundary";
import Spinner from "../../spinner/Spinner";
import { useRouter } from "next/router";

interface Post {
   userId: number;
   id: number;
   title: string;
   body: string;
}

const usePost = (id?: number) => {
   const { data, error } = useSWR<Post>(id ? `https://jsonplaceholder.typicode.com/posts/${id}` : null, {
      suspense: true,
   });
   return {
      post: data,
      error: error,
   };
};

const Post: FC<{ postId?: number; isPending: boolean }> = ({ postId, isPending }) => {
   const { post } = usePost(postId);
   return (
      <section id="post">
         <div style={isPending ? { opacity: 0.5 } : { opacity: 1 }}>
            <div>
               <strong>userId:</strong> {post?.userId}
            </div>
            <div>
               <strong>postId:</strong> {post?.id}
            </div>
            <div>
               <strong>title:</strong> {post?.title}
            </div>
            <div>
               <strong>body:</strong> {post?.body}
            </div>
            {isPending && (
               <div className="card-spinner">
                  <Spinner />
               </div>
            )}
         </div>
      </section>
   );
};

const PostDetail = () => {
   const router = useRouter();
   const { id } = router.query;
   useEffect(() => {
      if (id) {
         setPostId(Number(id as string));
      }
   }, [id]);
   const [postId, setPostId] = useState<number | undefined>(undefined);
   const [isPending, startTransition] = useTransition();
   const [isErr, setIsErr] = useState(false);
   const nextPost = () => {
      if (isErr) {
         setIsErr(false);
      }
      startTransition(() => setPostId((prev) => prev! + 1));
   };
   const prevPost = () => {
      if (isErr) {
         setIsErr(false);
      }
      startTransition(() => setPostId((prev) => prev! - 1));
   };

   return (
      <>
         <ErrorBoundary onError={() => setIsErr(true)} resetKeys={[isErr]} fallback={<p>Post {postId} is not found</p>}>
            <Suspense fallback={<Spinner />}>
               <Post isPending={isPending} postId={postId} />
            </Suspense>
         </ErrorBoundary>
         <button className="card-btn" onClick={prevPost}>
            previous
         </button>
         <button className="card-btn" onClick={nextPost}>
            next
         </button>
      </>
   );
};

export default PostDetail;
