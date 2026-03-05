import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../lib/database';
import { Note } from '../../../entities/Note';
import { Like } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const where: Record<string, unknown>[] = [];

    if (search) {
      const baseCondition: Record<string, unknown> = {};
      if (category) baseCondition.category = category;
      if (priority) baseCondition.priority = priority;

      where.push({ ...baseCondition, title: Like(`%${search}%`) });
      where.push({ ...baseCondition, content: Like(`%${search}%`) });
    } else {
      const condition: Record<string, unknown> = {};
      if (category) condition.category = category;
      if (priority) condition.priority = priority;
      where.push(condition);
    }

    const notes = await repo.find({
      where: where.length > 0 ? (where as Parameters<typeof repo.find>[0] extends { where?: infer W } ? W : never) : undefined,
      order: { createdAt: 'DESC' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Note);
    const body = await request.json();

    const { title, content, category, priority, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const note = repo.create({
      title,
      content,
      category: category || 'general',
      priority: priority || 'medium',
      tags: tags || '',
    });

    const saved = await repo.save(note);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/notes error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
