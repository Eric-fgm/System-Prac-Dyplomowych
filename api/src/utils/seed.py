import contextlib
from datetime import datetime

from ..schemas import UserCreate
from ..schemas import UserCreate
from ..routes.auth_router import get_user_manager, get_user_db
from ..db import get_session
from ..models.thesis import Thesis, ThesisStatus
from ..models.supervisor import Supervisor
from ..models.user import User

get_async_session_context = contextlib.asynccontextmanager(get_session)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)
get_user_manager_context = contextlib.asynccontextmanager(get_user_manager)


async def create_user(first_name: str, last_name: str, email: str, password: str, is_superuser: bool = False):
    try:
        async with get_async_session_context() as session:
            async with get_user_db_context(session) as user_db:
                async with get_user_manager_context(user_db) as user_manager:
                    user = await user_manager.create(
                        UserCreate(
                            first_name=first_name, last_name=last_name, email=email, password=password, is_superuser=is_superuser
                        )
                    )
                    return user
    except:
        return

async def create_supervisor(session, user_id: int, specialization: str = "Informatyka") -> Supervisor:
    supervisor = Supervisor(
        user_id=user_id,
        specialization=specialization
    )
    session.add(supervisor)
    await session.commit()
    await session.refresh(supervisor)
    await session.refresh(supervisor, attribute_names=["user"])
    return supervisor

async def seed():
    try:
        await create_user("Admin", "1", "admin.admin@gmail.com", "test", True)
        student1 = await create_user("Jan", "Kowalski", "jan.kowalski@gmail.com", "test")
        user1 = await create_user("Magda", "Polak", "magda.polak@gmail.com", "test")
        user2 = await create_user("Adam", "Nowak", "adam.nowak@gmail.com", "test")
        
        async with get_async_session_context() as session:
            supervisor = await create_supervisor(session, user1.id, "Informatyka")
            supervisor2 = await create_supervisor(session, user2.id, "Informatyka i Ekonometria")

            theses = [
                Thesis(
                    title="Zastosowanie sieci neuronowych do rozpoznawania emocji na podstawie mimiki twarzy",
                    description="Analiza i implementacja systemu rozpoznającego emocje z użyciem CNN i bibliotek OpenCV.",
                    status=ThesisStatus.available,
                    category="Sztuczna inteligencja",
                    deadline=datetime(2025, 6, 15),
                    kind="bachelor",
                    department="Informatyka",
                    year=2025,
                    supervisor_id=supervisor.id
                ),
                Thesis(
                    title="Platforma e-learningowa dla nauczycieli z funkcją wideokonferencji",
                    description="Aplikacja webowa umożliwiająca tworzenie i prowadzenie kursów online.",
                    status=ThesisStatus.available,
                    category="Aplikacje webowe",
                    deadline=datetime(2025, 7, 1),
                    kind="engineering",
                    department="Informatyka",
                    year=2025,
                    supervisor_id=supervisor.id
                ),
                Thesis(
                    title="System rezerwacji sal konferencyjnych z panelem administracyjnym",
                    description="Responsywna aplikacja do rezerwacji przestrzeni biurowych, uwzględniająca kalendarz dostępności.",
                    status=ThesisStatus.available,
                    category="Aplikacje webowe",
                    deadline=datetime(2025, 5, 20),
                    kind="master",
                    department="Zarządzanie",
                    year=2025,
                    supervisor_id=supervisor.id
                ),
                Thesis(
                    title="Inteligentny system podlewania ogrodu oparty na danych pogodowych",
                    description="Sterowanie nawadnianiem za pomocą danych pogodowych pobieranych z API oraz czujników wilgotności.",
                    status=ThesisStatus.available,
                    category="IoT",
                    deadline=datetime(2025, 8, 30),
                    kind="engineering",
                    department="Informatyka i Ekonometria",
                    year=2025,
                    supervisor_id=supervisor2.id
                ),
                Thesis(
                    title="Wykrywanie ataków typu SQL Injection w aplikacjach webowych",
                    description="Budowa systemu wykrywającego i raportującego próby ataków SQL Injection w czasie rzeczywistym.",
                    status=ThesisStatus.available,
                    category="Cyberbezpieczeństwo",
                    deadline=datetime(2025, 6, 10),
                    kind="master",
                    department="Informatyka",
                    year=2025,
                    supervisor_id=supervisor.id
                ),
            ]

            session.add_all(theses)
            await session.commit()
    except:
        pass