class Vocabulist < Padrino::Application
  register SassInitializer
  register Padrino::Rendering
  register Padrino::Mailer
  register Padrino::Helpers

  enable :sessions

  def self.thesaurus=(value)
    @@thesaurus = value
  end

  def self.thesaurus
    @@thesaurus
  end

end

