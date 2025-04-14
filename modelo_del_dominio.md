```mermaid
classDiagram
    class User {
        id: ObjectId
        username: string
        password: string
        mail: string
        name: string
        lastname: string
        dateOfBirth: date
        phoneNumber: string
        isAdmin: boolean
    }

    class Opinion {
        id: ObjectId
        calification: int
        comment: string
    }

    class Itinerary {
        id: ObjectId
        title: string
        description: string
        durationDays: int
    }

    class Participant {
        id: ObjectId
        name: string
        age: int
        disability: boolean
    }

    class Activity {
        id: ObjectId
        name: string
        description: string
        outdoor: boolean
        transport: boolean
        schedule: string
    }

    class Place {
        id: ObjectId
        name: string
        province: string
        country: string
        zipCode: string
        latitude: string
        longitude: string
    }

    class Preference {
        id: ObjectId
        name: string
        descripcion: string
    }

    class ExternalService {
        id: ObjectId
        serviceType: string
        name: string
        description: string
        adress: string
        schedule: string
        website: string [0..1]
        phoneNumber: string [0..1]
    }

    %% Relaciones
    User "1" --> "0..*" Opinion
    User "1" --> "0..*" Itinerary
    Itinerary "1" --> "0..*" Participant
    Itinerary "1" --> "0..*" Activity
    Activity "1" --> "1" Place
    Itinerary "1" --> "0..*" Preference
    Place "1" --> "0..*" ExternalService
