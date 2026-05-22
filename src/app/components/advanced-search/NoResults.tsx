interface NoResultsProps {
    searchTerm: string;
    suggestedTerm?: string;
    onRefineSearch?: () => void;
}

export default function NoResults({ searchTerm, suggestedTerm, onRefineSearch }: NoResultsProps) {
    return (
        <div className="bg-[#d9d9d9]  p-6 mt-6">
            {/* Did you mean */}
            {/* <div className="flex items-center gap-4 mb-4">
                <span className="text-[1rem] text-[#545454]">
                    Did you mean: <strong>{suggestedTerm || searchTerm}</strong>
                </span>
                <button
                    onClick={onRefineSearch}
                    className="text-[1rem] text-red-600 hover:underline"
                >
                    Refine Search
                </button>
            </div> */}

            {/* No match message */}
            <p className="text-[1rem] text-[#545454] mb-4">
                Your search for &ldquo;<strong>{searchTerm}</strong>&rdquo; did not match any products or information.
            </p>

            {/* Suggestions */}
            <h3 className="text-[22px] text-[#545454] font-light mb-3">Suggestions:</h3>
            <ul className="list-disc pl-6 text-[1rem] text-[#545454] space-y-1">
                <li>Make sure all words are spelled correctly.</li>
                <li>Try different keywords.</li>
                <li>Try more general keywords.</li>
            </ul>
        </div>
    );
}