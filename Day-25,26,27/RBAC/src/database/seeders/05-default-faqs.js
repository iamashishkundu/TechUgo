const { v4: uuidv4 } = require('uuid');

const categoriesWithFaqs = [
  {
    name: 'Orders & Shipping',
    sort_order: 1,
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'You can add items to your cart, apply any valid coupons, select your delivery address, and pay using your wallet balance.',
        sort_order: 1
      },
      {
        question: 'Can I cancel my order?',
        answer: 'You can cancel your order anytime while it is in "pending" status. Once confirmed or shipped, please contact customer support.',
        sort_order: 2
      },
      {
        question: 'How do refunds work?',
        answer: 'When an order is cancelled or refunded, the refund amount is credited directly back to your digital wallet immediately.',
        sort_order: 3
      }
    ]
  },
  {
    name: 'Wallet & Payments',
    sort_order: 2,
    faqs: [
      {
        question: 'How do I top up my wallet?',
        answer: 'Go to your Wallet section, enter the desired amount, and proceed with payment via our payment gateway.',
        sort_order: 1
      },
      {
        question: 'Is there an expiry on my wallet balance?',
        answer: 'No, your wallet balance does not expire and can be used for any future purchases.',
        sort_order: 2
      },
      {
        question: 'What should I do if an order payment fails?',
        answer: 'Ensure your wallet has sufficient balance. If your balance was deducted without an order confirmation, raise a support ticket.',
        sort_order: 3
      }
    ]
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingCats = await queryInterface.sequelize.query(
      'SELECT id, name FROM faq_categories',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingCatMap = new Map(existingCats.map((c) => [c.name, c.id]));

    for (const group of categoriesWithFaqs) {
      let categoryId = existingCatMap.get(group.name);
      if (!categoryId) {
        categoryId = uuidv4();
        await queryInterface.bulkInsert('faq_categories', [
          {
            id: categoryId,
            name: group.name,
            sort_order: group.sort_order,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
          }
        ]);
        existingCatMap.set(group.name, categoryId);
      }

      const existingFaqs = await queryInterface.sequelize.query(
        'SELECT question FROM faqs WHERE category_id = :categoryId',
        {
          replacements: { categoryId },
          type: Sequelize.QueryTypes.SELECT
        }
      );
      const existingQuestions = new Set(existingFaqs.map((f) => f.question));

      const faqsToInsert = group.faqs
        .filter((f) => !existingQuestions.has(f.question))
        .map((f) => ({
          id: uuidv4(),
          category_id: categoryId,
          question: f.question,
          answer: f.answer,
          sort_order: f.sort_order,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }));

      if (faqsToInsert.length > 0) {
        await queryInterface.bulkInsert('faqs', faqsToInsert);
      }
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('faqs', null, {});
    await queryInterface.bulkDelete('faq_categories', null, {});
  }
};
