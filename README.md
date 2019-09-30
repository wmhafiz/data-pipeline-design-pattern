# Data Pipeline Design Patterns

## Reader

Reader is used by Dispatcher worker to get Raw data into the queue.

Reader interface has a single Read method that will return a Readstream.

![Reader interface](https://carbon.now.sh/?bg=rgba(255%252C255%252C255%252C1)&t=paraiso-dark&wt=none&l=application%252Ftypescript&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=IBM%2520Plex%2520Mono&fs=17px&lh=131%2525&si=false&es=4x&wm=false&code=export%252520interface%252520Reader%252520%25257B%25250A%252520%252520read()%25253A%252520ReadStream%25253B%25250A%25257D)

Concrete classes include: `FileReader`, `RdbmsReader`, `EsReader`

![Reader class diagram](http://www.plantuml.com/plantuml/svg/ZPFFJiCm3CRlVOf8N42eBp0XBgXS9stS48UqCInIarHsoXy1xqwIGXkt6zqj_Mp__3bEjVM0px81iGEf03yB8Qun72-lDadQ-_1bYk-YQ5f99Evr2rFgXUiyYKscReEmoY1EEP6iHsySdqewwG-XCNdKzYKAZMjxOsdK7fyuOm_u2dZdh8N6QsSJvU38CqhdC0gsDpKW1rGqMWZbWmjAq50mfyUWjWhU9pg3xLHjZl1K_V3HGQX9yNXUxTA7g9K6-1ZXcjySAYOgwMKjYMS6gGLcSjXHPZ1VzDBtshBZ45iqPpwlwaZFwjo6qpCHPNaxVvGpJ4fPNEXolfGthUD4md-WYS3dgFBuVCZVqCrNMMQ3v2CEeUnNOZLPF-Ob1TbEMDcVZHy0)

## Command

Command is used by Processor & Writer to perform data transformation & data loading to another destination.

Command interface has a single `execute` method that will take a generic type instace and return the back type instace

![Command interface](https://carbon.now.sh/?bg=rgba(255%252C255%252C255%252C1)&t=paraiso-dark&wt=none&l=application%252Ftypescript&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=IBM%2520Plex%2520Mono&fs=17px&lh=131%2525&si=false&es=4x&wm=false&code=export%252520interface%252520Command%25253CT%25253E%252520%25257B%25250A%252520%252520execute(data%25253A%252520T)%25253A%252520T%25253B%25250A%25257D)

Concrete classes include: `Geocode`, `StandardizeCompanyName`, `HalalCompanyLookup`, `StandardizeAddressCity`

## Queue

Queue is responsible to publish jobs to workers that subscribed to the queues

Queue interface has `add`, `empty` and `on` methods.

![Queue interface](https://carbon.now.sh/?bg=rgba(255%252C255%252C255%252C1)&t=paraiso-dark&wt=none&l=application%252Ftypescript&ds=true&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=56px&ph=56px&ln=false&fl=1&fm=IBM%2520Plex%2520Mono&fs=17px&lh=131%2525&si=false&es=4x&wm=false&code=export%252520interface%252520Queue%25253CT%25253E%252520%25257B%25250A%252520%252520%25252F**%25250A%252520%252520%252520*%252520Creates%252520a%252520new%252520job%252520and%252520adds%252520it%252520to%252520the%252520queue.%25250A%252520%252520%252520*%252520If%252520the%252520queue%252520is%252520empty%252520the%252520job%252520will%252520be%252520executed%252520directly%25252C%25250A%252520%252520%252520*%252520otherwise%252520it%252520will%252520be%252520placed%252520in%252520the%252520queue%252520and%252520executed%252520as%252520soon%252520as%252520possible.%25250A%252520%252520%252520*%25252F%25250A%252520%252520add(data%25253A%252520T)%25253A%252520Promise%25253CJob%25253CT%25253E%25253E%25253B%25250A%25250A%252520%252520%25252F**%25250A%252520%252520%252520*%252520Consumes%252520the%252520queue%252520to%252520get%252520the%252520data%25250A%252520%252520%252520*%25252F%25250A%252520%252520on(event%25253A%252520string%25252C%252520cb%25253A%252520(data%25253A%252520T)%252520%25253D%25253E%252520void)%25253A%252520void%25253B%25250A%25250A%252520%252520%25252F**%25250A%252520%252520%252520*%252520Empties%252520a%252520queue%252520deleting%252520all%252520the%252520input%252520lists%252520and%252520associated%252520jobs.%25250A%252520%252520%252520*%25252F%25250A%252520%252520empty()%25253A%252520Promise%25253Cvoid%25253E%25253B%25250A%25257D%25250A%25250Aexport%252520interface%252520QueuePausable%252520%25257B%25250A%252520%252520%25252F**%25250A%252520%252520%252520*%252520Returns%252520a%252520promise%252520that%252520resolves%252520when%252520the%252520queue%252520is%252520paused.%25250A%252520%252520%252520*%252520The%252520pause%252520is%252520global%25252C%252520meaning%252520that%252520all%252520workers%252520in%252520all%252520queue%252520instances%252520for%252520a%252520given%252520queue%252520will%252520be%252520paused.%25250A%252520%252520%252520*%252520A%252520paused%252520queue%252520will%252520not%252520process%252520new%252520jobs%252520until%252520resumed%25252C%25250A%252520%252520%252520*%252520but%252520current%252520jobs%252520being%252520processed%252520will%252520continue%252520until%252520they%252520are%252520finalized.%25250A%252520%252520%252520*%25250A%252520%252520%252520*%252520Pausing%252520a%252520queue%252520that%252520is%252520already%252520paused%252520does%252520nothing.%25250A%252520%252520%252520*%25252F%25250A%252520%252520pause()%25253A%252520Promise%25253Cvoid%25253E%25253B%25250A%25250A%252520%252520%25252F**%25250A%252520%252520%252520*%252520Returns%252520a%252520promise%252520that%252520resolves%252520when%252520the%252520queue%252520is%252520resumed%252520after%252520being%252520paused.%25250A%252520%252520%252520*%252520The%252520resume%252520is%252520global%25252C%252520meaning%252520that%252520all%252520workers%252520in%252520all%252520queue%252520instances%252520for%252520a%252520given%252520queue%252520will%252520be%252520resumed.%25250A%252520%252520%252520*%25250A%252520%252520%252520*%252520Resuming%252520a%252520queue%252520that%252520is%252520not%252520paused%252520does%252520nothing.%25250A%252520%252520%252520*%25252F%25250A%252520%252520resume()%25253A%252520Promise%25253Cvoid%25253E%25253B%25250A%25257D)

Concrete classes include: `BullQueue` & `RabbitMqQueue`

## Workers

There are 4 type of workers:

- Dispatcher: read data from a data source and publish it into Raw Queue
- Processor: subscribe to Raw Queue and perform data transformation & publish it to Output Queue
- Writer: subscribe to Output Queue and load it to various data sources
- JobComplete: subscribe to Job Complete Queue and perform custom business logics

~[Workers](http://www.plantuml.com/plantuml/svg/XLBBQiCm4BphAmIv98JyW0c1qb9ABtqWwA7qeChRHZIsZ2ItDQ7_NhrYRsGdEGdDxipiZYHh2_g32w3Fm4lG3uqrUqBfqdODq88QgsNzwG7bAWxWTKV-214xRapYt79XbUu2JMZW5Y8-zvG22IyEbq7XHfg6Mx45xUaptVTIJFGbMJUjVMgXzME5SpqqR0AP_npNcOUNPRAOE_jl9KjlBlkrhrLLyReq_U8Y0KxbIclUhLD7j9dYzjIQLvSpEnYEKqkL51iUR97DuZRR38gFMWamHiK89t8AESoQs3PLIZlJtZL5boWukMZvegLDJtP6LhNsn2odGWwBJHiFiT-hTzVUxC32dL9V8K7u1T5Qc9VSyeAorxVHo8YrFp_SreawABF98ab6pePvZ-4VqzLgWxzkLWb6ESW8Vkq0XLZ6CFfof7zt97oCiUoUs2G-7w8XWE5Bd0811mKK3fB9KJP2ib3_0G00)

Example hooks:

- Generate Control Figure & Data Quality reports
- Sending email notifications