import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    await this.bookRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }

  async toggleLike(id: string, userId: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['likedBy'], // Load Relation likedBy
    });

    if (!book) {
      throw new Error('Book not found');
    }

    // Check if user already liked
    const userIndex = book.likedBy.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      // User found -> Unlike (Remove)
      book.likedBy.splice(userIndex, 1);
    } else {
      // User not found -> Like (Add)
      // We can push a partial object with ID, TypeORM handles the rest
      book.likedBy.push({ id: userId } as any);
    }

    // Update likeCount based on the array length
    book.likeCount = book.likedBy.length;

    return this.bookRepository.save(book);
  }
}
