require 'csv'
require 'json'

target = ARGV[0]
destination = ARGV[1]

output = {}

CSV.foreach target do |row|
  output[row[0]] = row.last(row.length - 1)
end

destination_file = open(destination, 'w+')
JSON.dump(output, destination_file)
destination_file.close
