import Image from "next/image";

const cards = [
  {
    id: 1,
    name: "products",
    image: "/images/card1.jpg",
    link: "/admin/products",
  },
  {
    id: 2,
    name: "persons",
    image: "/images/card2.jpg",
    link: "/admin/persons",
  },
  {
    id: 3,
    name: "معارض",
    image: "/images/card2.jpg",
    link: "/admin/exhibition",
  },
  {
    id: 4,
    name: "price list",
    image: "/images/card2.jpg",
    link: "/admin/priceList",
  },
];

const reports = [
  {
    id: 1,
    name: "report 1 ",
    image: "/images/card1.jpg",
    link: "/admin/products",
  },
  {
    id: 2,
    name: "report 2 ",
    image: "/images/card2.jpg",
    link: "/admin/persons",
  },
  {
    id: 3,
    name: "report 1 ",
    image: "/images/card1.jpg",
    link: "/admin/products",
  },
  {
    id: 4,
    name: "report 2 ",
    image: "/images/card2.jpg",
    link: "/admin/persons",
  },
];

const CardsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex-col flex justify-center items-center p-10">
      <h2 className="mt-8 text-right text-black font-bold text-2xl p-3">
        بيانات اساسيه
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <a
            key={card.id}
            href={card.link}
            className="text-blue-500 hover:underline block mt-2"
          >
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <Image
                src={card.image}
                alt={card.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">{card.name}</h3>
              </div>
            </div>
          </a>
        ))}
      </div>
      <h2 className="mt-8 text-right text-black font-bold text-2xl p-3 ">
        تقارير{" "}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reports.map((card) => (
          <div
            key={card.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <Image
              src={card.image}
              alt={card.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold">{card.name}</h3>
            </div>
            <div className="flex justify-between items-center p-4 text-center">
              <a
                href={card.link}
                className="text-blue-500 hover:underline block mt-2"
              >
                عرض
              </a>
              <button className="text-blue-500 hover:underline block mt-2 ">
                طباعه
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsPage;
