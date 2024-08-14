/*import { Repository } from "../shared/repository.js";
import { Consulting } from "./consulting.entity.js";

const consultings: Consulting[] = [
  new Consulting('1', 'Calle 1', 'Calle 2')
];

export class ConsultingRepository implements Repository<Consulting> {
    public findAll(): Consulting[] | undefined {
        return consultings;
    }

    public findOne(item: { id: string} ): Consulting | undefined {
        return consultings.find((consulting) => consulting.id === item.id);
    }

    public add(item: Consulting): Consulting | undefined {
        consultings.push(item);
        return item;
    }

    public update(item: Consulting): Consulting | undefined {
        const consultingId = consultings.findIndex((consulting) => consulting.id === item.id);
        if (consultingId !== -1) {
            Object.assign(consultings[consultingId], item);
        }
        return consultings[consultingId];
    }

    public delete(item: {id: string}): Consulting | undefined {
        const consultingId = consultings.findIndex(
            (consulting) => consulting.id === item.id
        );
        if (consultingId !== -1) {
            const delconsulting = consultings[consultingId];
            consultings.splice(consultingId, 1);
            return delconsulting;
        }
    }
}*/