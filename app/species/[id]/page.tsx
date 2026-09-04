interface SpeciesPageProps {
	params: Promise<{ id: string }>;
}

export default async function SpeciesPage({ params }: SpeciesPageProps) {
	const { id } = await params;

	return <main>Species: {id}</main>;
}
