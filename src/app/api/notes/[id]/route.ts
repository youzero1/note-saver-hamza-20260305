import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../../lib/database';
import { Note } from '../../../../entities/Note';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const note = await repo.findOneBy({ id });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('GET /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const note = await repo.findOneBy({ id });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, category, priority, tags } = body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;
    if (priority !== undefined) note.priority = priority;
    if (tags !== undefined) note.tags = tags;

    const updated = await repo.save(note);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const note = await repo.findOneBy({ id });
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await repo.remove(note);
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/notes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
