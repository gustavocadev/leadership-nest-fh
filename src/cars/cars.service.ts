import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  private cars: Car[] = [];

  findAll() {
    return this.cars;
  }

  findOneById(id: string) {
    const car = this.cars.find((car) => car.id === id);
    if (!car) throw new NotFoundException(`Car with ID '${id}' not found`);

    return car;
  }

  create(createCarDto: CreateCarDto) {
    const newCar: Car = {
      id: uuid(),
      ...createCarDto,
    };

    this.cars.push(newCar);

    return newCar;
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    const carInDB = this.findOneById(id);

    if (updateCarDto.id && updateCarDto.id !== id) {
      throw new BadRequestException(
        `ID '${updateCarDto.id}' is not equal to ID '${id}'`,
      );
    }

    carInDB.brand = updateCarDto.brand ?? carInDB.brand;
    carInDB.model = updateCarDto.model ?? carInDB.model;

    return carInDB;
  }
  delete(id: string) {
    const newCars = this.cars.filter((car) => car.id !== id);

    this.cars = newCars;

    return {
      msg: `Car with ID '${id}' has been deleted`,
    };
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }
}
