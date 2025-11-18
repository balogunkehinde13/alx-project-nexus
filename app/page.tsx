import PollList from "@/app/components/polls/PollList";
import Link from "next/link";
import { fetchPollsRequest } from "@/app/lib/api/polls";


export default async function LandingPage() {
  let polls = [];

  try {
    polls = await fetchPollsRequest();
  } catch (err) {
    console.error("Failed to fetch polls", err);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">

      {/* HERO SECTION */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Create Instant Polls</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Create polls, share them with anyone, and watch real-time results with beautiful charts.  
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/create"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Create a Poll
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* PUBLIC POLLS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Trending Public Polls</h2>

        {polls.length === 0 ? (
          <p className="text-gray-500">No polls yet. Be the first to create one!</p>
        ) : (
          <PollList polls={polls} />
        )}
      </section>
    </div>
  );
}
