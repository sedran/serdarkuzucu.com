module SerdarKuzucu
  module Filters
    def sk_sort_categories(categories)
      sorted = []
      categories.each { |category|
        sorted.push(category)
      }

      sorted.sort_by! {|element| element[0].downcase}
      sorted
    end
  end
end

Liquid::Template.register_filter(SerdarKuzucu::Filters)
