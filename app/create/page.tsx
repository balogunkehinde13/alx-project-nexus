import PollCreateForm from "../components/polls/PollCreateForm";

export default async function createPage() {
    

    return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create a New Poll</h1>
      <PollCreateForm />
    </div>
    )
}