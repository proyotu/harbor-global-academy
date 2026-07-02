function blocked() {
  return Response.json({ message: 'Direkter Supabase-Zugriff ist in Produktion deaktiviert. Bitte /api/partners verwenden.' }, { status: 403 });
}

export function GET() {
  return blocked();
}

export function POST() {
  return blocked();
}

export function PATCH() {
  return blocked();
}

export function DELETE() {
  return blocked();
}
