import BookingPageClient from './BookingPageClient';

export const metadata = {
  title: 'Termin buchen | Harbor Global Partner Academy',
  description: 'Zentrale Calendly-Terminbuchung mit Leonid Curos.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BookingPage({ searchParams }) {
  const params = await searchParams;
  return <BookingPageClient initialTypeId={params?.termin} />;
}
